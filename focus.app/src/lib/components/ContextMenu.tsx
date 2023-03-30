import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import {
  MouseEvent,
  Ref,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

interface MenuItem {
  label: string;
  icon?: JSX.Element;
  hotkey?: string;
  onClick?: (e: MouseEvent) => void;
}

interface ContextMenuProps {
  items: MenuItem[];
}

export interface IContextMenu {
  popup: (e: MouseEvent) => void;
}

export const ContextMenu = forwardRef(
  ({ items }: ContextMenuProps, ref: Ref<IContextMenu>) => {
    const [pos, setPos] = useState<{
      mouseX: number;
      mouseY: number;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      popup(e: MouseEvent) {
        e.preventDefault();
        setPos(
          pos == null ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 } : null
        );
      },
    }));

    function handleClose() {
      setPos(null);
    }

    function handleItemClick(e: MouseEvent, onClick?: (e: MouseEvent) => void) {
      handleClose();
      onClick && onClick(e);
    }

    const hasIcon = useMemo(() => {
      return items.findIndex((e) => !!e.icon) > -1;
    }, [items]);

    return (
      <Menu
        open={pos != null}
        anchorReference="anchorPosition"
        anchorPosition={
          pos !== null
            ? {
                top: pos.mouseY,
                left: pos.mouseX,
              }
            : undefined
        }
        onClose={handleClose}
      >
        <MenuList dense>
          {items.map((item) =>
            item.label === "-" ? (
              <Divider />
            ) : (
              <MenuItem onClick={(e) => handleItemClick(e, item.onClick)}>
                {hasIcon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText>{item.label}</ListItemText>
                {item.hotkey && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: "2rem" }}
                  >
                    {item.hotkey}
                  </Typography>
                )}
              </MenuItem>
            )
          )}
        </MenuList>
      </Menu>
    );
  }
);
