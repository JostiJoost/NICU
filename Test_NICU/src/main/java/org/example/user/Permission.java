package org.example.user;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_CREATE("admin:create"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_DELETE("admin:delete"),

    STUDIE_READ("studie:read"),
    STUDIE_CREATE("studie:create"),
    STUDIE_UPDATE("studie:update"),
    STUDIE_DELETE("studie:delete"),

    ALGEMEEN_READ("algemeen:read"),
    ALGEMEEN_CREATE("algemeen:create"),
    ALGEMEEN_UPDATE("algemeen:update"),
    ALGEMEEN_DELETE("algemeen:delete"),

    PROTOCOLMAKER_READ("protocolmaker:read"),
    PROTOCOLMAKER_CREATE("protocolmaker:create"),
    PROTOCOLMAKER_UPDATE("protocolmaker:update"),
    PROTOCOLMAKER_DELETE("protocolmaker:delete");


    @Getter
    private final String permission;
}
