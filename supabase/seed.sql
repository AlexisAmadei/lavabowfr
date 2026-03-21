insert into section_spotlight (title, subtitle, listen_link, status)
values
    ('Spotlight Item 1', 'Subtitle for item 1', 'https://example.com/listen1', 'ACTIVE'),
    ('Spotlight Item 2', 'Subtitle for item 2', 'https://example.com/listen2', 'INACTIVE');

insert into section_videos (description, url, status, "order")
values
    ('Video 1 Description', 'https://example.com/video1', 'ACTIVE', 1),
    ('Video 2 Description', 'https://example.com/video2', 'INACTIVE', 2);

insert into clicks_paliers (name, target)
values
    ('Palier 1', 10),
    ('Palier 2', 50),
    ('Palier 3', 60),
    ('Palier 4', 100);

insert into newsletter (email, verify_status, mailchimp_synced)
values
    ('exemple1@exemple.com', 'verified', true),
    ('exemple2@exemple.com', 'unverified', false);

insert into section_events (title, description, price, date, place, link)
values
    ('Event 1', 'Description for event 1', 20, '2024-12-01 18:00:00+00', 'Venue 1', 'https://example.com/event1'),
    ('Event 2', 'Description for event 2', 0, '2025-01-15 20:00:00+00', 'Venue 2', 'https://example.com/event2');
