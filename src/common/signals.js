const ForegroundSignals = {
    RENDER: "render",
    DELAY: "delay"
}

const BackgroundSignals = {
    ADD_STREAM: "add_stream",
    REMOVE_STREAM: "remove_stream",
    ADD_CHAT: "add_chat",
    REMOVE_CHAT: "remove_chat",
    SELECT_CHAT: "select_chat",
    REMOVE_CHAT_FRAME: "remove_chat_frame",
    UPDATE_STREAM_LAST_POS: "update_stream_last_pos",
    UPDATE_STREAM_LAST_SIZE: "update_stream_last_size",
    UPDATE_CHAT_FRAME_LAST_POS: "update_chat_frame_last_pos",
    UPDATE_CHAT_FRAME_LAST_SIZE: "update_chat_frame_last_size",
    ADD_TO_FAVORITES: "add_to_favorites",
    REMOVE_FROM_FAVORITES: "remove_from_favorites",
    UPDATE_DELAY: "update_delay",
    TOGGLE_DARK_MODE: "toggle_dark_mode",
    SHOW_CONTENT_OVERLAY: "show_content_overlay",
    UPDATE_STREAM_INIT_POS: "update_stream_init_pos",
    UPDATE_STREAM_INIT_SIZE: "update_stream_init_size",
    UPDATE_CHAT_FRAME_INIT_POS: "update_chat_frame_init_pos",
    UPDATE_CHAT_FRAME_INIT_SIZE: "update_chat_frame_init_size"
}

export {
    ForegroundSignals,
    BackgroundSignals
}