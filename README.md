# netify-openwrt-packages

OpenWrt package feed for [Netify](https://www.netify.ai/) per-application traffic statistics.

## Packages

| Package | Description |
|---|---|
| `netify-plugin-stats` | Netify Agent plugin — accumulates per-app/category stats into a ring-buffer store, exposes via ubus |
| `luci-app-netify-stats` | LuCI web UI — time-series charts for apps and categories, per-interface selector |

## Requirements

- OpenWrt 23.05 or newer
- `netifyd` installed and running
- `luci` installed (for `luci-app-netify-stats`)

## Installation

Add the feed to your buildroot's `feeds.conf` (or `feeds.conf.default`):

```
src-git netify https://github.com/mfoxworthy/netify-openwrt-packages.git
```

Then update and install:

```bash
./scripts/feeds update netify
./scripts/feeds install -a -p netify
```

Enable in `make menuconfig` under:
- **Network → netify-plugin-stats**
- **LuCI → Applications → luci-app-netify-stats**

Or add directly to `.config`:

```
CONFIG_PACKAGE_netify-plugin-stats=m
CONFIG_PACKAGE_luci-app-netify-stats=m
```

## Device configuration

After installation, add the interfaces to monitor in UCI:

```bash
uci add_list netify-stats.global.monitor_if='br-lan'
uci add_list netify-stats.global.monitor_if='eth1'
uci commit netify-stats
/etc/init.d/netifyd restart
```

The LuCI interface dropdown appears automatically when two or more interfaces are monitored.

## Source repositories

- Plugin: https://github.com/mfoxworthy/netify-plugin-stats
- LuCI app: https://github.com/mfoxworthy/luci-app-netify-stats
