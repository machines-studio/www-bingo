<ul>
  <?php foreach ($page->children()->listed() as $page) : ?>
    <li>
      <?php snippet('components/Card', compact('page')) ?>
    </li>
  <?php endforeach ?>
</ul>
