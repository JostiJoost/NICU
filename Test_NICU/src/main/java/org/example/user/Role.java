package org.example.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
public enum Role {
    ADMIN(Set.of(
            Permission.ADMIN_READ, Permission.ADMIN_UPDATE, Permission.ADMIN_DELETE, Permission.ADMIN_CREATE,
            Permission.ALGEMEEN_READ, Permission.ALGEMEEN_UPDATE, Permission.ALGEMEEN_DELETE, Permission.ALGEMEEN_CREATE,
            Permission.STUDIE_READ, Permission.STUDIE_UPDATE, Permission.STUDIE_DELETE, Permission.STUDIE_CREATE,
            Permission.PROTOCOLMAKER_READ, Permission.PROTOCOLMAKER_UPDATE, Permission.PROTOCOLMAKER_DELETE, Permission.PROTOCOLMAKER_CREATE
    )),
    STUDIE(Set.of(
            Permission.ALGEMEEN_READ, Permission.ALGEMEEN_UPDATE, Permission.ALGEMEEN_DELETE, Permission.ALGEMEEN_CREATE,
            Permission.STUDIE_READ, Permission.STUDIE_UPDATE, Permission.STUDIE_DELETE, Permission.STUDIE_CREATE
    )),
    ALGEMEEN(Set.of(
            Permission.ALGEMEEN_READ, Permission.ALGEMEEN_UPDATE, Permission.ALGEMEEN_DELETE, Permission.ALGEMEEN_CREATE
    )),
    PROTOCOLMAKER(Set.of(
            Permission.ALGEMEEN_READ, Permission.ALGEMEEN_UPDATE, Permission.ALGEMEEN_DELETE, Permission.ALGEMEEN_CREATE,
            Permission.PROTOCOLMAKER_READ, Permission.PROTOCOLMAKER_UPDATE, Permission.PROTOCOLMAKER_DELETE, Permission.PROTOCOLMAKER_CREATE
    ));

    @Getter
    private final Set<Permission> getPermissions;
    }


