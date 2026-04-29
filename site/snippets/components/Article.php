<?php
  $symbol ??= $slots->symbol();
  $title ??= $slots->title();
  $subtitle ??= $slots->subtitle();
  $nav ??= $slots->nav();

  $anchor ??= 'content';
  $content ??= $slots->content();

  $attributes ??= [];
  $attributes['class'] = 'article ' . ($attributes['class'] ?? '');
?>

<article <?= attr($attributes) ?>>
  <header class='article__header'>
    <h2 class='article__title' <?= r($symbol, "data-symbol='$symbol'") ?>>
      <?= $title ?>
    </h2>

    <?php if ($nav) : ?>
      <nav class='article__nav'><?= $nav ?></nav>
    <?php endif ?>
  </header>

  <?php if ($subtitle) : ?>
    <h3 class='article__subtitle'><?= $subtitle ?></h3>
  <?php endif ?>

  <section class='article__content' id='<?= $anchor ?>'>
    <?= $content ?>
  </section>
</article>
