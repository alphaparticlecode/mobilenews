import React from 'react';
import { AppRegistry, Image, ListView, StyleSheet, Text, View, WebView, StatusBarIOS } from 'react-native';

var HTMLView = require('react-native-htmlview').default;

var REQUEST_URL = 'https://dailyprophet.alphaparticle.com/wp-json/wp/v2/posts?filter[paged]=';

export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      page: 1,
    }
  }
  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
          <Text style={styles.headerText}>Mobile News</Text>
        </View>
        <ListView
          renderRow={this.renderStory}
          dataSource={this.state.dataSource}
          style={styles.listView}
        />
      </View>
    );
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData(){
    var currentUrl = REQUEST_URL + this.state.page;
    
    fetch(currentUrl)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true,
          page: this.state.page + 1
        });
      })
      .done();
  }
  renderStory(story) {
    return (
      <View style={styles.storyContainer}>
        {story.featured_image_url ?
          <Image
          style={styles.storyThumbnail}
          source={{uri: story.featured_image_url}}
        />
        : null}
        
        <Text style={styles.headline}>
          {story.title.rendered}
        </Text>
        <HTMLView
          value={story.excerpt.rendered}
          stylesheet={styles}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingTop: 50,
    paddingBottom: 50
  },
  headline: {
    fontSize: 36,
    marginBottom: 10,
  },
  bodyCopy: {
    fontSize: 18,
  },
  storyContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: -60,
    paddingLeft: 12,
    paddingRight: 10,
    alignItems: 'stretch',
    marginBottom: 60
  },
  storyThumbnail: {
    flex: 1,
    height: 200,
    width: 350,
    marginTop: 10
  },
  header: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ca0002',
    height: 60,
    marginTop: -50,
    paddingTop: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
  },
  testStyles: {
    color: 'white',
  },
  p: {
    marginBottom: -60
  }
});
