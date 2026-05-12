<?php
  $slug ??= '';
  $snippet = snippet("playgrounds/$slug", [], true);

  $caption ??= $slots->caption();

  $attributes ??= [];
  $attributes['data-slug'] = $slug;
  $attributes['class'] = 'playground ' . ($attributes['class'] ?? '');
?>

<figure <?= attr($attributes) ?>>
  <div class='playground__content'>
    <canvas class='playground__cursor'></canvas>

    <button title='Remettre à zéro' class='playground__reset'>
      <?php snippet('svg/reset') ?>
    </button>

    <?= trim($snippet) ? $snippet : $slug ?>
  </div>

  <figcaption>
    <span><?= $caption ?></span>
    <a href='<?= $slug ?>' class='readmore'>en savoir plus</a>
  </figcaption>
</figure>
