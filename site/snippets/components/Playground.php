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
    <?= trim($snippet) ? $snippet : $slug ?>
  </div>

  <?php if ($caption) : ?>
    <figcaption><?= $caption ?></figcaption>
  <?php endif ?>
</figure>
