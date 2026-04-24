import { storage } from "@vendetta/plugin";
import { after } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import Settings from "./Settings";

/**
 * GhostMessages
 *
 * Intercepts every message you send and immediately deletes it,
 * leaving no trace in the channel. Controlled via a toggle in
 * the plugin settings page.
 */

let patches: (() => void)[] = [];

export default {
    onLoad: () => {
        // Default: disabled on first install
        storage.enabled ??= false;

        const MessageActions = findByProps("sendMessage", "deleteMessage");

        if (!MessageActions) {
            console.error("[GhostMessages] Could not find MessageActions module.");
            return;
        }

        /*
         * Hook AFTER sendMessage so Discord processes the send normally
         * (assigns a snowflake ID, etc.) and then we immediately request
         * deletion using that fresh message ID.
         */
        patches.push(
            after("sendMessage", MessageActions, (args, result) => {
                if (!storage.enabled) return;

                // args[0] = channelId, result is a Promise<{ body: { id } }>
                const channelId: string = args[0];

                Promise.resolve(result)
                    .then((res: any) => {
                        const messageId: string | undefined = res?.body?.id;
                        if (!messageId) return;

                        MessageActions.deleteMessage(channelId, messageId);
                    })
                    .catch(() => {
                        // Silently swallow — the message may have already
                        // failed to send for an unrelated reason.
                    });
            })
        );
    },

    onUnload: () => {
        for (const unpatch of patches) unpatch();
        patches = [];
    },

    settings: Settings,
};
