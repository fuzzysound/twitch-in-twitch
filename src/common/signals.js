const ForegroundSignals = {
    DELAY: "delay",
    MOVE_FORWARD: "move_forward",
    MOVE_BACK: "move_back",
    GOTO: "goto",
    REFRESH: "refresh",
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
    TOGGLE_VOD_MOVE_TIME_TOGETHER: "toggle_vod_move_time_together",
    TOGGLE_VOD_SPOILER_FREE: "toggle_vod_spoiler_free",
    SHOW_CONTENT_OVERLAY: "show_content_overlay",
    UPDATE_STREAM_INIT_POS: "update_stream_init_pos",
    UPDATE_STREAM_INIT_SIZE: "update_stream_init_size",
    UPDATE_CHAT_FRAME_INIT_POS: "update_chat_frame_init_pos",
    UPDATE_CHAT_FRAME_INIT_SIZE: "update_chat_frame_init_size",
    RESET_CONTENT_STATE: "reset_content_state",
    RESET_FAVORITE_STATE: "reset_favorite_state",
    CHANGE_STREAM_LAYER_TO_INNER: "change_stream_layer_to_inner",
    CHANGE_STREAM_LAYER_TO_OUTER: "change_stream_layer_to_outer",
    CHANGE_TIME_MOVE_UNIT: "change_time_move_unit",
    RESET_POSITION_AND_SIZE: "reset_position_and_size",
}

export {
    ForegroundSignals,
    BackgroundSignals
}