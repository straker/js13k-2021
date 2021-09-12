import { Button, imageAssets } from '../libs/kontra';
import { GRID_SIZE, COLORS } from '../constants';
import tileatlas from '../assets/tileatlas.json';

export default class ImageButton extends Button.class {
  draw() {
    const { name, context, width, height } = this;
    const atlas = tileatlas[name];
    const end = GRID_SIZE * (0.5 + atlas.width);

    context.fillStyle = COLORS.BLACK;
    context.fillRect(0, 0, end, end);

    context.drawImage(
      imageAssets.tilesheet,
      atlas.col * GRID_SIZE,
      atlas.row * GRID_SIZE,
      atlas.width * GRID_SIZE,
      atlas.height * GRID_SIZE,
      GRID_SIZE / 4,
      GRID_SIZE / 4,
      width,
      height
    );
    context.lineWidth = 2;

    if (this.focused || this.selected) {
      context.strokeStyle = COLORS.YELLOW;
    } else {
      context.strokeStyle = COLORS.WHITE;
    }

    context.strokeRect(0, 0, end, end);
  }
}