select m.id, m.name, m.status,
       string_agg(s.size || '=' || coalesce(s.stock::text,'unlimited'), ', ' order by s.size) as sizes
  from public.merch_items m
  join public.merch_item_sizes s on s.merch_item_id = m.id
 where m.status <> 'DELETED'
 group by m.id, m.name, m.status
 order by m.id;
