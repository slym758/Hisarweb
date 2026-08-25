# localization Specification

## Purpose
Sitenin iki dilli (Türkçe + İngilizce) çalışmasının temelini kurar: locale-farkında
yönlendirme, arayüz metinlerinin çevrilebilirliği, aktif dilin belirlenmesi ve eksik
çeviride öngörülebilir fallback.

## Requirements

### Requirement: Locale-farkında yönlendirme
Sistem, Türkçe içeriği kök yol altında, İngilizce içeriği `/en` önekiyle sunmalıdır
(SHALL); geçerli locale her istekten belirlenebilir olmalıdır.

#### Scenario: Türkçe varsayılan
- **WHEN** kullanıcı `/en` ile başlamayan bir yola gider
- **THEN** aktif dil Türkçe olur ve arayüz Türkçe render edilir

#### Scenario: İngilizce prefix
- **WHEN** kullanıcı `/en` ile başlayan bir yola gider
- **THEN** aktif dil İngilizce olur ve arayüz İngilizce render edilir

### Requirement: Arayüz metinleri çevrilebilir
Sistem, arayüz (nav, layout, ortak) metinlerini tek dile gömmek yerine locale'e göre
çözülen bir çeviri mekanizmasından sağlamalıdır (SHALL); TR-only hardcode ile EN
bloke edilmemelidir.

#### Scenario: Nav etiketleri dile göre çözülür
- **WHEN** aktif dil değişir
- **THEN** navigasyon ve footer etiketleri ilgili dilde görünür

### Requirement: Dil değiştirici
Sistem, kullanıcıya aktif dili değiştirme imkânı vermeli (SHALL) ve seçim sonrası
uygun locale yoluna yönlendirmelidir.

#### Scenario: TR'den EN'e geçiş
- **WHEN** kullanıcı dil değiştiriciden İngilizce'yi seçer
- **THEN** İngilizce sürüme (`/en...`) yönlendirilir ve arayüz İngilizce olur

### Requirement: Eksik çeviri fallback'i
Sistem, bir metnin aktif dilde çevirisi yoksa sessizce kırılmamalı; tanımlı bir
fallback (varsayılan dile düşme veya açık bir "yakında" göstergesi) uygulamalıdır (SHALL).

#### Scenario: İngilizce çeviri eksik
- **WHEN** İngilizce'de bir arayüz metni tanımlı değildir
- **THEN** sistem Türkçe karşılığına düşer veya açık bir yer tutucu gösterir; boş ya da
  kırık render etmez
