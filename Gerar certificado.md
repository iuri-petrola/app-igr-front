

## Gerar certificado

# 1. Instale o Certbot (Let's Encrypt)

    apt update && apt install certbot python3-certbot-nginx -y


# 2. Execute o Certbot para obter o certificado SSL

    certbot --nginx -d app-igr.duckdns.org
    
   # em modo silent
    sudo certbot --nginx --non-interactive --agree-tos --email iuri.petrola@gmail.com -d app-igr.duckdns.org


# 3. Verifique se o certificado foi instalado corretamente: 
    (Os arquivos fullchain.pem (certificado) e privkey.pem (chave privada) devem estar lá.)

    sudo ls -l /etc/letsencrypt/live/app-igr.duckdns.org/


# OBS: 
# Renovação automática: O Certbot já configura um cronjob para renovar o certificado. Teste manualmente com:

    sudo certbot renew --dry-run