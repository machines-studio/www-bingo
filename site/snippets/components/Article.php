<?php
  $symbol ??= $slots->symbol();
  $title ??= $slots->title();
  $subtitle ??= $slots->subtitle();
  $nav ??= $slots->nav();

  $anchor ??= 'content';
  $content ??= $slots->content();
  $layouts ??= new \Kirby\Cms\Layouts();

  $attributes ??= [];
  $attributes['class'] = 'article ' . ($attributes['class'] ?? '');
?>

<article <?= attr($attributes) ?>>
  <?php if (trim($title ?? '')) : ?>
    <header class='article__header'>
      <h2 class='article__title' <?= r($symbol, "data-symbol='$symbol'") ?>>
        <?= $title ?>
      </h2>

      <?php if ($nav) : ?>
        <nav class='article__nav'><?= $nav ?></nav>
      <?php endif ?>
    </header>
  <?php endif ?>

  <?php if (trim($subtitle ?? '')) : ?>
    <h3 class='article__subtitle'><?= $subtitle ?></h3>
  <?php endif ?>

  <section class='article__content' id='<?= $anchor ?>'>
    <?= $content ?>

    <?php foreach ($layouts as $layout) : ?>
      <?php $columns = $layout->columns() ?>
      <section class='columns' data-cols='<?= $columns->count() ?>'>
        <?php foreach ($columns as $column) : ?>
          <div class='column'>
            <div class='blocks'>
              <?= $column->blocks() ?>
            </div>
          </div>
          <?php endforeach ?>
      </section>
    <?php endforeach ?>
  </section>
</article>
