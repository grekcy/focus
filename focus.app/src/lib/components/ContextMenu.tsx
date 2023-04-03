import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import {
  MouseEvent,
  Ref,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { EmptyIcon } from "./Icons";

export interface Action {
  label: string;
  icon?: JSX.Element;
  hotkey?: string;
  onEnabled?: () => boolean;
  onExecute?: (e: MouseEvent) => void;
}

interface ContextMenuProps {
  actions: Action[];
  dense?: boolean | undefined;
}

export interface IContextMenu {
  popup: (e: MouseEvent) => void;
}

export function PopupContextMenu(e: MouseEvent, ref: RefObject<IContextMenu>) {
  ref.current && ref.current.popup(e);
}

const ContextMenu = forwardRef(
  ({ actions: items, dense }: ContextMenuProps, ref: Ref<IContextMenu>) => {
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

    function handleMenuItemClick(
      e: MouseEvent,
      onClick?: (e: MouseEvent) => void
    ) {
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
        <MenuList dense={dense}>
          {items.map((item) =>
            item.label === "-" ? (
              <Divider />
            ) : (
              <MenuItem onClick={(e) => handleMenuItemClick(e, item.onExecute)}>
                {hasIcon && (
                  <ListItemIcon>
                    {item.icon ? item.icon : <EmptyIcon fontSize="small" />}
                  </ListItemIcon>
                )}
                <ListItemText primary={item.label} />
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
export default ContextMenu;
