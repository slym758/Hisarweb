import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'hisar-ui';

export function FAQ() {
    return (
        <Accordion type="single" collapsible defaultValue="item-1" style={{ width: 420 }}>
            <AccordionItem value="item-1">
                <AccordionTrigger>Randevumu nasıl iptal ederim?</AccordionTrigger>
                <AccordionContent>Panelde Randevular bölümünden ilgili kaydı açıp "İptal Et" seçeneğini kullanabilirsiniz.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Doktor çalışma saatlerini kim düzenler?</AccordionTrigger>
                <AccordionContent>Bölüm yöneticileri kendi doktorlarının uygunluk takvimini düzenleyebilir.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Hasta verileri nerede saklanır?</AccordionTrigger>
                <AccordionContent>Tüm veriler KVKK uyumlu olarak şifreli biçimde saklanır.</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
