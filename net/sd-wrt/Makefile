include $(TOPDIR)/rules.mk

PKG_NAME:=sd-wrt
PKG_VERSION:=0.1.0
PKG_RELEASE:=1

PKG_SOURCE:=v$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/mfoxworthy/sd-wrt/archive/refs/tags
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_HASH:=4c36e321fbc461c8e3d2d482fb7ed97ac02ab63d3bd63bf99ef11b3d685662b0

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

PKG_LICENSE:=GPL-3.0-or-later
PKG_MAINTAINER:=mike.foxworthy@gmail.com

include $(INCLUDE_DIR)/package.mk

define Package/sd-wrt
  SECTION:=net
  CATEGORY:=Network
  TITLE:=SD-WRT: application-aware WAN path selection
  DEPENDS:=+kmod-nft-core +nftables +ip-full +ubus +uci +jsonfilter +rpcd
endef

define Package/sd-wrt/description
  Probe and policy daemons for intelligent multi-WAN routing.
endef

define Package/sd-wrt/conffiles
/etc/config/sd-wrt
endef

define Build/Compile
endef

define Package/sd-wrt/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) $(CURDIR)/files/etc/config/sd-wrt $(1)/etc/config/
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) $(CURDIR)/files/etc/init.d/sd-wrt-probe  $(1)/etc/init.d/
	$(INSTALL_BIN) $(CURDIR)/files/etc/init.d/sd-wrt-policy $(1)/etc/init.d/
	$(INSTALL_DIR) $(1)/etc/hotplug.d/iface
	$(INSTALL_BIN) $(CURDIR)/files/etc/hotplug.d/iface/25-sd-wrt $(1)/etc/hotplug.d/iface/
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(CURDIR)/files/usr/bin/sd-wrt-probe  $(1)/usr/bin/
	$(INSTALL_BIN) $(CURDIR)/files/usr/bin/sd-wrt-policy $(1)/usr/bin/
	$(INSTALL_DIR) $(1)/usr/libexec/rpcd
	$(INSTALL_BIN) $(CURDIR)/files/usr/libexec/rpcd/luci.sd-wrt $(1)/usr/libexec/rpcd/
endef

$(eval $(call BuildPackage,sd-wrt))
