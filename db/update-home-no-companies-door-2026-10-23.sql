-- Homepage: Companies door removed (Saad, Oct 23 2026). The text is kept in case it comes back; labels say it's hidden.
-- The Companies page itself stays, linked from the footer.
UPDATE page_text SET label = 'Companies door (not shown on the homepage): title' WHERE page = 'home' AND block = 'door_partners_title';
UPDATE page_text SET label = 'Companies door (not shown on the homepage): text' WHERE page = 'home' AND block = 'door_partners_text';
