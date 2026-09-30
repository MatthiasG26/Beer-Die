// Settings for the App Store build. The website ignores the ad settings.
// Until you have your own AdMob ad unit, these are Google's official TEST ids (safe to use while testing).
// When AdMob gives you a real interstitial ad unit id, paste it below and set testing to false.
window.BEERDIE_APP = {
  supportEmail: "matthiasgomez26@gmail.com",   // shown in the app as the contact for reports and help
  ads: {
    iosInterstitial: "ca-app-pub-3940256099942544/4411468910",  // Google test interstitial (iOS)
    testing: true,
    everyGames: 2          // show one full-screen ad after every 2 finished games, never during play
  }
};
