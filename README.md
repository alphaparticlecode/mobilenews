# Mobile News
A React Native client to consume the WP Rest API.  Currently only iOS.  Android version will be added when iOS working prototype is complete.

##Setup
Local setup is the same as the [standard setup for react native](https://facebook.github.io/react-native/docs/getting-started.html#content).


##Modifications to the WordPress install

Currently, the client requires an addition of a featured_image_url field to the API response coming from WordPress to avoid having to make an additional API call for each featured image.  This can be configured as follows (this code goes in functions.php or wherever actions are registered in your theme) :

```
add_action( 'rest_api_init', 'response_register_feat_img' );
function response_register_feat_img() {
    register_rest_field( 'post',
        'featured_image_url',
        array(
            'get_callback'    => 'response_get_feat_img',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

/**
 * Get the URL for the featured image for a given post
 *
 * @param array $object Details of current post.
 * @param WP_REST_Request $request Current request
 *
 * @return mixed
 */
function response_get_feat_img( $object, $request ) {
     return wp_get_attachment_url( get_post_thumbnail_id( $object[ 'id' ] ) );
}
```

In addition, the excerpt can be cleaned up a bit so that it doesn't render a screen reader link on a mobile device.
```
/**
 * Strip the screen reader content out of the excerpt
 *
 * @param string $output Original excerpt.
 *
 * @return string $output New excerpt
 */
function twentyten_custom_excerpt_more( $output ) {
  $pattern = '/(<span class=\"screen-reader-text\">.*)<\/p>/';
  $replacement = '';

  return preg_replace($pattern, $replacement, $output);
}
add_filter( 'the_excerpt', 'twentyten_custom_excerpt_more' );
```