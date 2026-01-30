import { FormProvider } from "@/context/FormContext2";
import { Slot, Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <FormProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
    </FormProvider>
  );
}
