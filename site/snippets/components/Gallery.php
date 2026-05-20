<?php
  $attributes ??= [];
  $attributes['class'] = 'gallery ' . ($attributes['class'] ?? '');
?>

<section <?= attr($attributes) ?>>
  <ul>
    <?php foreach ($images as $image) : ?>
      <li>
        <?php snippet('html/image', compact('image')) ?>
      </li>
    <?php endforeach ?>
  </ul>
</section>
