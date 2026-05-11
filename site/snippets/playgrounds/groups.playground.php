<?php
  $colors = [
    // hsl(360deg 100% 100%)
    'rouge' => [[0, 100, 50], 'white'],
    'orange' => [[30, 100, 50], 'black'],
    'jaune' => [[60, 100, 50], 'black'],
    'vert' => [[140, 100, 50], 'black'],
    'bleu' => [[240, 100, 50], 'white'],
    'violet' => [[280, 100, 50], 'white']
  ]
?>

<ul>
  <?php foreach ($colors as $name => $color) : ?>
    <?php list(list($h, $s, $l), $contrast) = $color ?>
    <li <?= attr([
      'data-h' => $h,
      'data-s' => $s,
      'data-l' => $l,
      'style' => implode(';', [
        "--contrast: $contrast",
        "--h: {$h}deg",
        "--s: {$s}%",
        "--l: {$l}%"
      ])
    ]) ?>>
      <span><?= $name ?></span>
    </li>
  <?php endforeach ?>
</ul>
<button>générer une couleur aléatoire</button>
