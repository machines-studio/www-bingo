<?php
  $attributes ??= [];
  $attributes['class'] = 'card ' . ($attributes['class'] ?? '');

  $attributes['style'] = implode(';', [
    '--color-page: ' . $page->color()->toHex()->or('initial')
  ])
?>

<section <?= attr($attributes) ?>>
  <a href='<?= $page->url() ?>'>
    <h2 class='card__title' data-number='<?= sprintf('%02d', $page->num()) ?>'>
      <?= $page->title() ?>
    </h2>

    <?php snippet('html/image', [
      'image' => $page->cover()->toFile()
    ]) ?>
  </a>
</section>
