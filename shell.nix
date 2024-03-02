with import <nixpkgs> { };

pkgs.mkShell {
  buildInputs = [
    nodejs-16_x
    cocoapods
  ];

  shellHook = ''
    export WORKING_DIR=$(pwd)
    alias ct='cd $WORKING_DIR/CapThat'
    alias sa='cd $WORKING_DIR/SocialApp'
    alias nr='npm run'
    # Need to use the system base64 for BoringSSL cocoapod
    export PATH=/usr/bin:$PATH
  '';
}

