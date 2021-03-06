<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Redemption extends Model
{
    protected $table = 'redemption';
    protected $fillable = ['member_id', 'staff_id', 'bonus_id', 'note', 'points', 'app_id'];

    public function setNoteAttribute($value)
    {
        $this->attributes['note'] = $value == null ? '': $value;
    }

    public function setMemberIdAttribute($value)
    {
        $this->attributes['member_id'] = $value == null ? 0: $value;
    }

    public function setStaffIdAttribute($value)
    {
        $this->attributes['staff_id'] = $value == null ? 0: $value;
    }

    public function setBonusIdAttribute($value)
    {
        $this->attributes['bonus_id'] = $value == null ? 0: $value;
    }

    public function setPointsAttribute($value)
    {
        $this->attributes['points'] = $value == null ? 0: $value;
    }
}
