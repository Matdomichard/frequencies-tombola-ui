import { Lot } from "./lot.model";
import { Player } from "./player.model";

export interface DrawResult {
  players: Player[];
  lots:    Lot[];
}
