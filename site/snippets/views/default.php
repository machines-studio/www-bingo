<?php snippet('components/Article', [
  'title' => $page->title(),
  'subtitle' => $page->subtitle(),
  'nav' => Html::a('#content', '↓')
], slots: true) ?>
  <?php slot('content') ?>
    <?php foreach ($page->layout()->toLayouts() as $layout) : ?>
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
  <?php endSlot() ?>
<?php endSnippet() ?>
