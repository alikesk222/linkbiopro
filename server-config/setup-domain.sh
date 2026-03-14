#!/bin/bash
# ============================================================
# linkbiopro.com.tr domain setup script
# Çalıştır: bash setup-domain.sh
# ============================================================
set -e

DOMAIN="linkbiopro.com.tr"
APP_PORT="3003"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

echo "==> Nginx config yazılıyor..."

cat > "$NGINX_CONF" <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name linkbiopro.com.tr www.linkbiopro.com.tr;

    # HTTP → HTTPS yönlendirme (SSL sonrası aktif)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass         http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade            $http_upgrade;
        proxy_set_header   Connection         "upgrade";
        proxy_set_header   Host               $host;
        proxy_set_header   X-Real-IP          $remote_addr;
        proxy_set_header   X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto  $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_buffering    off;
    }
}
NGINX

# sites-enabled symlink
if [ ! -L "$NGINX_ENABLED" ]; then
    ln -s "$NGINX_CONF" "$NGINX_ENABLED"
fi

# default site varsa devre dışı bırak
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

echo "==> Nginx test ediliyor..."
nginx -t

echo "==> Nginx yeniden başlatılıyor..."
systemctl reload nginx

echo ""
echo "==> HTTP aktif. Şimdi SSL kuruluyor..."
echo "    certbot yüklü değilse önce kur: snap install --classic certbot"
echo ""

# Certbot (Let's Encrypt)
if command -v certbot &>/dev/null || snap run certbot --version &>/dev/null 2>&1; then
    CERTBOT_CMD="certbot"
    command -v certbot &>/dev/null || CERTBOT_CMD="snap run certbot"

    $CERTBOT_CMD --nginx \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --non-interactive \
        --agree-tos \
        --email admin@linkbiopro.com.tr \
        --redirect

    systemctl reload nginx
    echo ""
    echo "==> SSL kuruldu! https://${DOMAIN} hazır."
else
    echo "!!! certbot bulunamadı. Kurulum:"
    echo "    snap install --classic certbot"
    echo "    ln -sf /snap/bin/certbot /usr/bin/certbot"
    echo "    Sonra: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi

echo ""
echo "=== TAMAMLANDI ==="
echo "Site: https://${DOMAIN}"
