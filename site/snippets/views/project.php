<?php
  $prev = $page->prev();
  $next = $page->next();
  $metas = $page->metas() ?? new Kirby\Content\Field();
?>

<?php snippet('components/Article', [
  'symbol' => sprintf('%02d', $page->num()),
  'title' => $page->title(),
  'subtitle' => $page->subtitle(),
  'layouts' => $page->layout()->toLayouts()
], slots: true) ?>
  <?php slot('nav') ?>
    <a <?= attr(['href' => $prev?->url(), 'disabled' => !$prev]) ?>>←</a>
    <a <?= attr(['href' => $next?->url(), 'disabled' => !$next]) ?>>→</a>
  <?php endSlot() ?>

  <?php slot('content') ?>
    <section class='abstract'>
      <div class='prose'>
        <?= $page->abstract()->kirbytext() ?>
      </div>

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
    </section>

    <?php snippet('components/Gallery', [
      'images' => $page->gallery()->toFiles()
    ]) ?>
  <?php endSlot() ?>
<?php endsnippet() ?>
