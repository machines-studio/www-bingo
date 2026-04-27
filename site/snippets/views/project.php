<?php
  $prev = $page->prev();
  $next = $page->next();
  $metas = $page->metas() ?? new Kirby\Content\Field();
?>

<header>
  <h2 data-number='<?= sprintf('%02d', $page->num()) ?>'>
    <?= $page->title() ?>
  </h2>

  <nav>
    <a <?= attr(['href' => $prev?->url(), 'disabled' => !$prev]) ?>>←</a>
    <a <?= attr(['href' => $next?->url(), 'disabled' => !$next]) ?>>→</a>
  </nav>
</header>

<?php if (trim($subtitle = $page->subtitle())) : ?>
  <h3>
    <?= $subtitle ?>
  </h3>
<?php endif ?>

<article>
  <section class='prose'>
    <?= $page->text()->kirbytext() ?>
  </section>

  <aside>
    <ul>
      <?php foreach ($metas->toStructure() as $meta) : ?>
        <li>
          <span class='label'><?= $meta->label()->html() ?></span>
          <span class='value'><?= $meta->text()->kirbytextinline() ?></span>
        </li>
      <?php endforeach ?>
    </ul>
  </aside>
</article>

<?php snippet('components/Gallery', [
  'images' => $page->images() // TODO[panel]
]) ?>
