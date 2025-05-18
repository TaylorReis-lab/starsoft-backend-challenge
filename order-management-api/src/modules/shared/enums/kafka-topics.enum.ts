export enum KafkaTopics {
  ORDER_CREATED = 'order_created',
  ORDER_UPDATED = 'order_updated',
  ORDER_STATUS_CHANGED = 'order_status_changed',
  PAYMENT_PROCESSED = 'payment_processed',
  INVENTORY_UPDATED = 'inventory_updated'
}

export enum KafkaConsumerGroups {
  ORDER_SERVICE = 'order_service_group',
  NOTIFICATION_SERVICE = 'notification_service_group',
  INVENTORY_SERVICE = 'inventory_service_group'
}