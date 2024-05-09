package cz.kudladev.backend;

import java.util.List;

public interface ItemService {

    List<Item> getAllItems();
    Item getItemById(Long id);
    Item createItem(Item item);
    void deleteItem(Long id);

}
