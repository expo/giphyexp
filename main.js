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

const IMAGE_STYLES = [
  'original',
  'fixed_height',
  'fixed_height_downsampled',
  'fixed_height_small',
];

class Giphyexp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: 'adventure time',
      imageStyle: IMAGE_STYLES[0],
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
      let style = this.state.imageStyle;
      results.forEach((result) => {
        let webp = result.images[style].webp;
        let gif = result.images[style].url;
        let width = parseInt(result.images[style].width, 10);
        let height = parseInt(result.images[style].height, 10);
        images.push({webp, gif, width, height});
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
                  style={{ borderRadius: 5, width: WindowWidth, height: ((image.height / image.width) * WindowWidth) }} />
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

        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)'}}>
          <TouchableOpacity
            onPress={this.toggleFormat.bind(this)}
            style={{paddingHorizontal: 20, paddingVertical: 10, height: 40, backgroundColor: 'orange', borderRadius: 5 }}>
            <Text>
              currently using: {this.state.format}
            </Text>
          </TouchableOpacity>

            <TouchableOpacity
              onPress={this.toggleImageStyle.bind(this)}
              style={{paddingHorizontal: 20, height: 40, paddingVertical: 10, marginLeft: 15, backgroundColor: 'orange', borderRadius: 5, alignSelf: 'center' }}>
              <Text>
                {this.state.imageStyle}
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  toggleImageStyle() {
    let currentImageStyleIdx = IMAGE_STYLES.indexOf(this.state.imageStyle);
    this.setState({
      imageStyle: IMAGE_STYLES[(currentImageStyleIdx + 1) % IMAGE_STYLES.length],
    });

    this.refreshImages(this.state.searchText);
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
