type Item<T> = {
  value: T | WeightedRandomPicker<T>; // Value can be a nested picker or a regular item
  weight: number;
};

/**
 * This Class is a weighted random picker with removal once it reaches an item. It also allows for nesting
 */
export class WeightedRandomPicker<T> {
  private items: Array<Item<T>>;
  private cumulativeWeights: number[];

  constructor(items: Array<Item<T>>) {
    this.items = items;
    this.cumulativeWeights = this.buildCumulativeWeights(items);
  }

  // Normalize the weights and create a cumulative weight array
  private buildCumulativeWeights(items: Array<Item<T>>): number[] {
    const cumulative: number[] = [];
    let totalWeight = items.reduce((sum, item) => sum + item.weight, 0); // Sum all weights
    let cumulativeSum = 0;

    for (const item of items) {
      cumulativeSum += item.weight / totalWeight; // Normalize each weight
      cumulative.push(cumulativeSum); // Add to cumulative weights
    }

    return cumulative;
  }

  // Picks an item based on weighted probabilities, with optional removal
  public pickRandom(): T {
    const rand = Math.random();
    let selectedIndex = this.cumulativeWeights.findIndex(
      (weight) => rand <= weight,
    );

    // If no item is found (fallback case), select the last item
    if (selectedIndex === -1) {
      selectedIndex = this.items.length - 1;
    }

    const selectedItem = this.items[selectedIndex].value;

    // If the selected item is a WeightedRandomPicker, handle nested selection
    if (selectedItem instanceof WeightedRandomPicker) {
      const result = selectedItem.pickRandom();

      // Remove the nested picker if it becomes empty
      if (selectedItem.isEmpty()) {
        this.removeItemAt(selectedIndex);
      }

      return result;
    }

    // Remove the selected item and rebuild weights
    this.removeItemAt(selectedIndex);

    return selectedItem;
  }

  // Helper method to remove an item and rebuild weights
  private removeItemAt(index: number) {
    this.items.splice(index, 1);
    this.cumulativeWeights = this.buildCumulativeWeights(this.items);
  }

  // Check if there are no items left
  public isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// // Example usage with nested WeightedRandomPickers and removal:
// const topic1 = new WeightedRandomPicker([
//   { value: "t1-q1", weight: 1 },
//   { value: "t1-q2", weight: 1 },
// ]);

// const subTopic1 = new WeightedRandomPicker([
//   { value: "st1-q1", weight: 1 },
//   { value: "st1-q2", weight: 1 },
//   { value: "st1-q3", weight: 1 },
// ]);

// const subTopic2 = new WeightedRandomPicker([
//   { value: "st2-q1", weight: 1 },
//   { value: "st2-q2", weight: 1 },
//   { value: "st2-q3", weight: 1 },
// ]);

// const topic2 = new WeightedRandomPicker([
//   { value: subTopic1, weight: 1 },
//   { value: subTopic2, weight: 1 },
// ]);

// const items = [
//   { value: topic1, weight: 50 },
//   { value: topic2, weight: 30 },
// ];

// const picker = new WeightedRandomPicker(items);

// // To pick a random item without removal:
// console.log(picker.pickRandom());
// console.dir(picker, { depth: Infinity });
