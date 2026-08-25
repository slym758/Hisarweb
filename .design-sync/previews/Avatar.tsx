import { Avatar, AvatarFallback, AvatarImage } from 'hisar-ui';

const row = { display: 'flex', gap: 12, alignItems: 'center' } as const;

export function WithImage() {
    return (
        <div style={row}>
            <Avatar>
                <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Dr. Mehmet Demir" />
                <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Dr. Ayşe Yılmaz" />
                <AvatarFallback>AY</AvatarFallback>
            </Avatar>
        </div>
    );
}

export function Fallbacks() {
    return (
        <div style={row}>
            <Avatar>
                <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>AY</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>ZK</AvatarFallback>
            </Avatar>
        </div>
    );
}
