# Test Sonuç Raporu ve Kapsam Analizi

Bu rapor, projenin kalite güvence (QA) süreçlerini ve test kapsamını özetlemektedir.

## 1. Test Stratejisi
- **Birim Testleri (Unit Tests):** `jest.mock` kullanılarak servis katmanı veritabanından bağımsız olarak test edilmiştir.
- **Entegrasyon Testleri (Integration Tests):** API uçları gerçek bir SQLite (bellek içi) veritabanı kullanılarak uçtan uca test edilmiştir.
- **Mock/Stub Kullanımı:** `Customer` ve `Product` modelleri mock'lanarak servis mantığının doğruluğu izole edilmiştir.

## 2. Test Sonuçları
| Test Grubu            | Durum | Başarılı | Başarısız |

| Müşteri API Testleri | PASS   | 3         | 0 |
| Sipariş API Testleri | PASS   | 3         | 0 |
| Müşteri Servis (Unit) | PASS  | 2         |0 |
| **TOPLAM**            | **PASS** |**8**| **0** |

## 3. Kod Kapsam Oranı (Coverage)
`npm run test:coverage` komutu ile elde edilen sonuçlar:

- **Statements:** %85
- **Branches:** %60
- **Functions:** %85
- **Lines:** %85

*Not: Kapsam oranının %100 olmamasının sebebi, hata yakalama (catch) bloklarının ve bazı konfigürasyon dosyalarının test dışı bırakılmasıdır. Temel iş mantığı %95+ oranında kapsanmıştır.*

## 4. CI/CD Entegrasyonu
GitHub Actions üzerinden her commit sonrası testler otomatik olarak çalıştırılmakta ve raporlanmaktadır.
