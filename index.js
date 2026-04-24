// GhostMessages - Vendetta Plugin
// Automatically deletes your messages instantly after sending.

const { after } = vendetta.patcher;
const { findByProps } = vendetta.metro;
const { storage } = vendetta.plugin;
const { React } = vendetta.metro.common;
const { Forms } = vendetta.ui.components;

const { FormSection, FormRow, FormSwitch, FormText } = Forms;

function Settings() {
    vendetta.storage.useProxy(storage);

    return React.createElement(
        FormSection,
        { title: "Ghost Messages" },
        React.createElement(FormRow, {
            label: "Enable Ghost Mode",
            subLabel: "Instantly delete every message you send after it's received by Discord.",
            trailing: React.createElement(FormSwitch, {
                value: storage.enabled,
                onValueChange: (value) => {
                    storage.enabled = value;
                }
            })
        }),
        React.createElement(FormText, {
            style: { marginHorizontal: 16, marginTop: 4, opacity: 0.5, fontSize: 12 }
        }, "⚠️ Use responsibly. Server bots may still log deleted messages.")
    );
}

let patches = [];

export default {
    onLoad: () => {
        storage.enabled ??= false;

        const MessageActions = findByProps("sendMessage", "deleteMessage");

        if (!MessageActions) {
            console.error("[GhostMessages] Could not find MessageActions.");
            return;
        }

        patches.push(
            after("sendMessage", MessageActions, (args, result) => {
                if (!storage.enabled) return;

                const channelId = args[0];

                Promise.resolve(result)
                    .then((res) => {
                        const messageId = res?.body?.id;
                        if (!messageId) return;
                        MessageActions.deleteMessage(channelId, messageId);
                    })
                    .catch(() => {});
            })
        );
    },

    onUnload: () => {
        for (const unpatch of patches) unpatch();
        patches = [];
    },

    settings: Settings,
};
