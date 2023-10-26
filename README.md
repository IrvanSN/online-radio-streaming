# RADIO HEBAT
RADIO HEBAT, Online Radio Streaming Berbasis Website dengan Penerapan Protokol HLS(Http Live Streaming).

## Langkah Instalasi
### Prerequisites
- Make sure nodejs installed to your computer
- Generate Self-signed certificate (WebRTC works only on https) using mkcert
- Drop .pem file to folder /ssl_key
- Create .env in root folder project
- Add SSL_KEY and SSL_CERT environment variable (.env.example for example .env variable)

### Installation Guide
1. masuk ke direktori project dan jalankan perintah "npm install" untuk menginstall dependency
2. jalankan perintah "npm run start" untuk menjalankan server
3. kunjungi http://localhost:8000/radio untuk memutar radio

### Guide to broadcast a Radio
1. Open https://localhost:3000/radio/broadcast and select which radio you want to host
2. Select audio file to broadcast
3. Click "Broadcast Now" to start broadcasting

## Fitur
- Play Radio
- Stop Radio
- Change Radio Channel
