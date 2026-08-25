import { Button, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from 'hisar-ui';
import { useForm } from 'react-hook-form';

export function DoctorForm() {
    const form = useForm({
        defaultValues: { name: 'Dr. Mehmet Demir', title: 'Kardiyoloji Uzmanı', bio: '' },
    });

    return (
        <Form {...form}>
            <form style={{ display: 'grid', gap: 16, maxWidth: 380 }} onSubmit={(e) => e.preventDefault()}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ad Soyad</FormLabel>
                            <FormControl>
                                <Input placeholder="Ad Soyad" {...field} />
                            </FormControl>
                            <FormDescription>Doktorun panelde görünecek adı.</FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unvan</FormLabel>
                            <FormControl>
                                <Input placeholder="Unvan" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kısa Özgeçmiş</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Birkaç cümleyle tanıtım" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Kaydet</Button>
            </form>
        </Form>
    );
}
