# Elamram MCHJ — Vizitka Sayt

Bolalar klinikasi va sertifikatlangan dorixona uchun professional vizitka sayt.

- **Domen:** elamram.uz
- **Manzil:** Xorazm viloyati, Urganch sh. P.Maxmud ko'chasi, 55-uy
- **Telefon:** +998 99 503 03 33
- **Email:** elamram@mail.ru

---

## Texnologiyalar

- HTML5 + CSS3 + Vanilla JavaScript (framework yo'q)
- Nginx (static file server)
- Docker (konteynerizatsiya)

---

## Fayl tuzilmasi

```
elamram-website/
├── index.html           # Asosiy sahifa
├── css/
│   └── style.css        # Barcha stillар
├── js/
│   └── main.js          # Navbar, modal, animatsiyalar
├── assets/
│   ├── logo.png         # Asosiy logo
│   ├── favicon.svg      # Brauzer ikonkasi
│   └── cert-*.svg       # Sertifikat placeholder rasmlar
├── docs/
│   ├── litsenziya.pdf   # Tibbiy litsenziya
│   ├── gppsertifikat.pdf# GPP sertifikati
│   └── guvohnoma.jpg    # Davlat guvohnomasi
├── Dockerfile
├── nginx.conf
└── .dockerignore
```

---

## Docker bilan ishga tushirish

### Build

```bash
docker build -t elamram-web .
```

### Ishga tushirish (8092 port)

```bash
docker run -d \
  --name elamram \
  --restart unless-stopped \
  -p 8092:8092 \
  elamram-web
```

### To'xtatish / o'chirish

```bash
docker stop elamram
docker rm elamram
```

### Loglarni ko'rish

```bash
docker logs -f elamram
```

---

## Nginx reverse proxy (namuna)

```nginx
server {
    listen 80;
    server_name elamram.uz www.elamram.uz;

    location / {
        proxy_pass http://127.0.0.1:8092;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

SSL uchun (Let's Encrypt):

```bash
certbot --nginx -d elamram.uz -d www.elamram.uz
```

---

## Kontent tahrirlash

| Nima o'zgartirish | Qaysi fayl | Qayerdan |
|-------------------|-----------|----------|
| Telefon / email / manzil | `index.html` | `#contact` bo'limi |
| Google Maps iframe | `index.html` | `contact__map` div |
| Hujjatlar (PDF/JPG) | `docs/` papka | faylni almashtiring |
| Logo | `assets/logo.png` | faylni almashtiring |
| Ranglar | `css/style.css` | `:root` CSS variables |
| Ish vaqti | `index.html` | `contact-item` (soat ikonkasi) |
| Telegram / Instagram | `index.html` | `footer__social` bo'limi |

---

## Yangi hujjat qo'shish

1. Faylni `docs/` papkaga joylashtiring
2. `index.html` da yangi `cert-card` blokini ko'chiring
3. `data-type="pdf"` yoki `data-type="image"` ni belgilang
4. `data-file="docs/fayl-nomi.pdf"` ni to'g'rilang
5. Dockerni rebuild qiling

---

## Saytning bo'limlari

1. **Hero** — asosiy banner, taglayn, CTA tugmalar
2. **About** — kompaniya haqida, qadriyatlar (Ishonch / Sifat / G'amxo'rlik)
3. **Services** — 4 ta klinika xizmati + dorixona kartasi
4. **Certificates** — litsenziya, guvohnoma, GPP sertifikati (modal bilan)
5. **Contact** — manzil, telefon, email, ish vaqti, Google Maps
6. **Footer** — sahifa havolalari, ijtimoiy tarmoqlar
