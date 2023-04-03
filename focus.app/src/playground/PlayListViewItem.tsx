import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { CardItem } from "../lib/components/CardList";
import { Card } from "../lib/proto/focus_pb";

 function PlayCardListViewItem() {
  const app = useFocusApp();
  const api = useFocusClient();
  const [card, setCard] = useState<Card.AsObject | null>(null);
  useEffect(() => {
    api
      .getCard(2102)
      .then((r) => setCard(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      {card && <CardItem card={card} index={0} />}
    </DndProvider>
  );
}
export default PlayCardListViewItem;