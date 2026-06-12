include $(TOPDIR)/rules.mk

LUCI_TITLE:=Netify per-application statistics (LuCI)
LUCI_DEPENDS:=+luci-base +netify-plugin-stats +rpcd
LUCI_PKGARCH:=all

PKG_VERSION:=1.0.1
PKG_RELEASE:=1

PKG_LICENSE:=GPL-3.0-or-later
PKG_MAINTAINER:=mike.foxworthy@gmail.com

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
