# dnsmasq

```bash
brew install dnsmasq
```

## dnsmasq config

```bash
dhcp-range=10.0.0.32,10.0.0.248,255.255.255.0,2h
# Gateway
dhcp-option=3,10.0.0.4
# DNS (This is where your transparent proxy runs )
dhcp-option=6,10.0.0.1

## start dnsmasq
```bash
/usr/local/sbin/dnsmasq -C dnsmasq.conf
```

# forward traffic via mac

## Enable IP forwarding

```bash
sudo sysctl -w net.inet.ip.forwarding=1
```

## forward http and https traffic to port 8080

Create a file called pf.conf, have the following config. If you want only port 80 remove 443 

```bash
rdr on en0 inet proto tcp to any port {80, 443} -> 127.0.0.1 port 8080
```

config pf.conf with the rules and enable it

```bash
sudo pfctl -f pf.conf
sudo pfctl -e
```

##  Configure sudoers to allow mitmproxy to access pfctl.

In /etc/sudoers

```bash
ALL ALL=NOPASSWD: /sbin/pfctl -s state
```
# Fire up mitmproxy

```bash
mitmproxy --mode transparent --showhost
```
