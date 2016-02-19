'use strict';

import React, {
  AppRegistry,
  Component,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const WindowWidth = Dimensions.get('window').width;

class Giphyexp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: 'adventure time',
      format: 'webp',
      images: [],
    };
  }

  componentWillMount() {
    this.refreshImages(this.state.searchText);
  }

  refreshImages(searchText) {
    // This is just the development API key from Giphy's docs
    fetch(`http://api.giphy.com/v1/gifs/search?q=${searchText}&api_key=dc6zaTOxFJmzC`).
      then((response) => response.json()).
      then((response) => {
      let results = response.data;
      let images = [];
      results.forEach((result) => {
        let webp = result.images.original.webp;
        let gif = result.images.original.url;
        let still = result.images.original_still.url;
        let width = parseInt(result.images.original.width, 10);
        let height = parseInt(result.images.original.height, 10);
        images.push({webp, gif, still, width, height});
      });

      this.setState({images});
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <ScrollView
          removeClippedSubviews
          contentContainerStyle={{overflow: 'hidden', backgroundColor: '#000', alignItems: 'center', justifyContent: 'center'}}
          style={styles.container}>
          {this.state.images.map((image, i) => {
            if (!image.webp || !image.gif) {
              return;
            }

            return (
              <View style={styles.imageContainer} key={i}>
                <Image
                  source={this.state.format === 'webp' ? {uri: image.webp} : {uri: image.gif}}
                  style={{ width: WindowWidth, height: ((image.width / image.height) * WindowWidth) }} />
              </View>
            );
          })}
        </ScrollView>
        <View style={{position: 'absolute', top: 24, left: 0, right: 0, height: 65, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)'}}>
          <TextInput
            style={{height: 35, flex: 1, marginHorizontal: 10, paddingLeft: 5,}}
            value={this.state.searchText}
            onSubmitEditing={() => { this.refreshImages(this.state.searchText) }}
            onChangeText={(value) => { this.setState({searchText: value}) }} />
        </View>

        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: 'rgba(255,255,255,0.2)'}}>
          <TouchableOpacity onPress={this.toggleFormat.bind(this)} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'orange', borderRadius: 5, alignSelf: 'center', marginTop: 15,}}>
            <Text>
              currently using: {this.state.format}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  toggleFormat() {
    if (this.state.format === 'webp') {
      this.setState({format: 'gif'});
    } else {
      this.setState({format: 'webp'});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  imageContainer: {
    overflow: 'hidden',
  },
});

AppRegistry.registerComponent('main', () => Giphyexp);
