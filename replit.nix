{
  pkgs,
}: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.libx11
    pkgs.libxcomposite
    pkgs.libxcursor
    pkgs.libxdamage
    pkgs.libxext
    pkgs.libxfixes
    pkgs.libxi
    pkgs.libxrandr
    pkgs.libxrender
    pkgs.libxss
    pkgs.libxtst
    pkgs.alsa-lib
    pkgs.at-spi2-atk
    pkgs.cairo
    pkgs.cups
    pkgs.dbus
    pkgs.expat
    pkgs.gdk-pixbuf
    pkgs.glib
    pkgs.gtk+3
    pkgs.nspr
    pkgs.nss
    pkgs.pango
    pkgs.xorg.libX11
    pkgs.xorg.libXScrnSaver
    pkgs.xorg.libxkbfile
    pkgs.xorg.libxshmfence
    pkgs.xorg.libxxf86vm
    pkgs.xvfb_run
  ];
  environment.variables = {
    CYPRESS_INSTALL_BINARY = "0";
  };
}
