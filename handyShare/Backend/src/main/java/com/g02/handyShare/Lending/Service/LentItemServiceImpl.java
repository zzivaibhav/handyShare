package com.g02.handyShare.Lending.Service;

import com.g02.handyShare.Lending.Entity.LentItem;
import com.g02.handyShare.Lending.Repository.LentItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LentItemServiceImpl implements LentItemService {

    @Autowired
    private LentItemRepository lentItemRepository;

    @Override
    public List<LentItem> getAllLentItems() {
        return lentItemRepository.findAll();
    }

    @Override
    public LentItem addLentItem(LentItem lentItem) {
        return lentItemRepository.save(lentItem);
    }

    @Override
    public LentItem updateLentItem(Long id, LentItem lentItemDetails) {
        LentItem lentItem = lentItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        lentItem.setName(lentItemDetails.getName());
        lentItem.setDescription(lentItemDetails.getDescription());
        lentItem.setPrice(lentItemDetails.getPrice());
        lentItem.setAvailability(lentItemDetails.getAvailability());
        lentItem.setCategory(lentItemDetails.getCategory());
        lentItem.setCity(lentItemDetails.getCity());
        lentItem.setState(lentItemDetails.getState());
        lentItem.setPincode(lentItemDetails.getPincode());
        lentItem.setAddress(lentItemDetails.getAddress());
        lentItem.setImageName(lentItemDetails.getImageName());

        return lentItemRepository.save(lentItem);
    }

    @Override
    public void deleteLentItem(Long id) {
        if (!lentItemRepository.existsById(id)) {
            throw new RuntimeException("Item not found");
        }
        lentItemRepository.deleteById(id);
    }
}
