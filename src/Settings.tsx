import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { React } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";

const { FormSection, FormRow, FormSwitch, FormText } = Forms;

/**
 * Settings screen for GhostMessages.
 *
 * Renders a single toggle that enables / disables the auto-delete
 * behaviour. All state is persisted via @vendetta/plugin storage so
 * the preference survives app restarts.
 */
export default function Settings() {
    useProxy(storage);

    return (
        <FormSection title="Ghost Messages">
            <FormRow
                label="Enable Ghost Mode"
                subLabel="Instantly delete every message you send. Recipients will briefly see the message before it vanishes."
                leading={<FormRow.Icon source={{ uri: "https://cdn.discordapp.com/emojis/1234567890.webp" }} />}
                trailing={
                    <FormSwitch
                        value={storage.enabled}
                        onValueChange={(value: boolean) => {
                            storage.enabled = value;
                        }}
                    />
                }
            />
            <FormText style={{ marginHorizontal: 16, marginTop: 4, opacity: 0.5, fontSize: 12 }}>
                ⚠️ Use responsibly. Deleted messages may still be logged by server bots or cached by recipients.
            </FormText>
        </FormSection>
    );
}
