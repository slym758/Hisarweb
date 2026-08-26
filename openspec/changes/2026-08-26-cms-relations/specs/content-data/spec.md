## ADDED Requirements

### Requirement: AUTO/MANUEL ilgili içerik çözümü
Sistem, bir detay kaydının ilgili içeriklerini (tedavi/hastalık/teknoloji/video) AUTO veya MANUEL olarak SUNMALIDIR (SHALL). Editör `related_items` üzerinden MANUEL seçim yaptıysa bu seçimler `position` sırasıyla ve otomatiği geçersiz kılarak döner; hiçbir MANUEL satır yoksa sistem aynı bölüme (department) göre OTOMATİK sonuçlar (yayında + sıralı + kendisi hariç) döndürmelidir. Public getter imzaları (`getTreatmentsForDept`/`getDiseasesForDept`/`getTechnologiesForDept`/`getVideosForDept`) değişmez; getter'lar sayfada `related` prop'u varsa ilgili dilimi, yoksa mevcut in-memory sonuçları kullanır — böylece `related` göndermeyen sayfalar birebir korunur.

#### Scenario: MANUEL seçim otomatiği geçersiz kılar
- **WHEN** bir doktor için `related_items`'ta hedef tipi Treatment olan bir/birden çok satır varsa
- **THEN** doktor detay sayfasının ilgili tedaviler listesi tam olarak o seçimleri `position`
  sırasıyla gösterir ve aynı-bölüm otomatik sonuçları gösterilmez

#### Scenario: MANUEL yokken AUTO ile birebir
- **WHEN** bir kayıt için hiçbir `related_items` satırı yok
- **THEN** ilgili içerikler aynı bölümden (Technology için pivot/`dept_slugs`) otomatik gelir,
  kendisi hariç, yalnız yayında olanlar, sıralı ve limitli — eski görünümle aynıdır

#### Scenario: Boş/eksik dilim güvenli
- **WHEN** sayfa `related` prop'u gönderir ama bir tür için sonuç boşsa
- **THEN** o ilgili bölüm hiç render edilmez (grup gizlenir), diğer türler etkilenmez

### Requirement: department_technology pivotu
Sistem, teknoloji-bölüm çok-çoklu ilişkisini gerçek bir `department_technology` pivotunda TUTMALIDIR (SHALL) ve pivotu her Technology'nin düz `dept_slugs` dizisinden (slug→department id) idempotent biçimde kurmalıdır; bu pivot otomatik teknoloji çözümünde (AutoRelatedResolver) kullanılır. Seeder yeniden çalıştırıldığında satırları çoğaltmamalı veya editör bağlantılarını silmemelidir.

#### Scenario: Pivot dept_slugs'tan kurulur
- **WHEN** `RelationSeeder` çalışır
- **THEN** her Technology, `dept_slugs`'undaki her geçerli slug için ilgili departmana `position`
  ile bağlanır ve tekrar çalıştırma yeni satır eklemez
