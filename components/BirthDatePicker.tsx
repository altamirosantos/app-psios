import { useThemeColor } from '@/hooks/useThemeColor';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    value: Date;
    onChange: (date: Date) => void;
};

const textColor = useThemeColor('text');
const cardColor = useThemeColor('cardBackground');
const placeholder = useThemeColor('placeholder');
const inputBg = useThemeColor('inputBackground');

export default function BirthDatePicker({ value, onChange }: Props) {
    const [day, setDay] = useState(value.getDate());
    const [month, setMonth] = useState(value.getMonth() + 1);
    const [year, setYear] = useState(value.getFullYear());

    useEffect(() => {
        const date = new Date(year, month - 1, day);
        onChange(date);
    }, [day, month, year]);

    const generateArray = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const days = generateArray(1, 31);
    const months = generateArray(1, 12);
    const years = generateArray(1900, new Date().getFullYear());

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Data de Nascimento</Text>
            <View style={styles.row}>
                <Picker style={styles.picker} selectedValue={day} onValueChange={setDay}>
                    {days.map(d => (
                        <Picker.Item key={d} label={d.toString()} value={d} />
                    ))}
                </Picker>
                <Picker style={styles.picker} selectedValue={month} onValueChange={setMonth}>
                    {months.map(m => (
                        <Picker.Item key={m} label={m.toString()} value={m} />
                    ))}
                </Picker>
                <Picker style={styles.picker} selectedValue={year} onValueChange={setYear}>
                    {years.reverse().map(y => (
                        <Picker.Item key={y} label={y.toString()} value={y} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontWeight: '500', marginBottom: 4 },
    row: { flexDirection: 'row', gap: 10 },
    picker: { flex: 1, backgroundColor: inputBg, borderRadius: 10, color: textColor },
});
